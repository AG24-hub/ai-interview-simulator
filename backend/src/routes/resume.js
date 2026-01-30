const express = require('express');
const multer = require('multer');
const { supabase } = require('../lib/supabase');
const resumeParser = require('../services/resumeParser');

const router = express.Router();

// Multer config
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Middleware: authenticate user
async function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No authorization header' });

    const token = authHeader.replace('Bearer ', '');
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) return res.status(401).json({ error: 'Invalid token' });
        req.user = user;
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(401).json({ error: 'Authentication failed' });
    }
}

// POST: upload resume
router.post('/upload', authenticateUser, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        console.log('File received:', req.file.originalname);

        const rawText = await resumeParser.extractText(req.file); // ✅ use extractText
        const parsedData = resumeParser.simpleParser(rawText);   // ✅ parse features

        const { data: resume, error } = await supabase
            .from('resumes')
            .insert({
                user_id: req.user.id,
                file_name: req.file.originalname,
                raw_text: rawText,
                parsed_data: parsedData
            })
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, resume });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message || 'Failed to process resume' });
    }
});

// GET a single resume by ID
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const { data: resume, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id) // Security: ensure the resume belongs to the logged-in user
            .single();

        if (error || !resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.json({ success: true, resume });
    } catch (err) {
        console.error('Fetch single resume error:', err);
        res.status(500).json({ error: 'Failed to fetch resume details' });
    }
});

module.exports = router;
