import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const ResumeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await api.getResume(id);
        setResume(data.resume || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#84a98c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{error || "Resume not found"}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-[#84a98c] text-white rounded-md hover:bg-[#6b8e73] transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const parsedData = resume.parsed_data || {};
  const isProcessing = !resume.parsed_data;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2f3e46] mb-1">
              {parsedData.name || "Untitled Resume"}
            </h1>
            <p className="text-gray-600 text-sm">
              Filename: {resume.file_name}
            </p>
          </div>
          <button
            onClick={() =>
              navigate("/interview/start", { state: { resumeId: resume.id } })
            }
          
            disabled={isProcessing}
            className={`px-6 py-3 text-white rounded-md font-semibold shadow-md transition-all ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#84a98c] hover:bg-[#6b8e73]"
            }`}
          >
            {isProcessing ? "Processing..." : "Start Interview →"}
          </button>
        </div>

        {/* Processing State Warning */}
        {isProcessing && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This resume is still being analyzed by the AI. Some details
                  may be missing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Parsed Information Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#2f3e46] mb-6">
            Parsed Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {parsedData.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {parsedData.phone || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Experience:</span>{" "}
                  {parsedData.yearsOfExperience
                    ? `${parsedData.yearsOfExperience} years`
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Detected Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills?.length > 0 ? (
                  parsedData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#84a98c]/10 text-[#2f3e46] rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No skills detected yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          {parsedData.summary && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {parsedData.summary}
              </p>
            </div>
          )}
        </div>

        {/* Raw Sections */}
        {parsedData.rawSections &&
          Object.keys(parsedData.rawSections).length > 0 && (
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-[#2f3e46] mb-6">
                Resume Sections
              </h2>

              <div className="space-y-4">
                {Object.entries(parsedData.rawSections).map(
                  ([section, content]) => (
                    <div
                      key={section}
                      className="border-l-4 border-[#84a98c] pl-4"
                    >
                      <h3 className="font-semibold text-gray-700 capitalize mb-2">
                        {section}
                      </h3>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {content}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 text-[#84a98c] hover:text-[#6b8e73] font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResumeView;
