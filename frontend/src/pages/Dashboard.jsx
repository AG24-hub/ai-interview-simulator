import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-[800px] bg-white shadow-xl rounded-lg overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="bg-[#84a98c] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button 
            onClick={handleSignOut}
            className="w-full md:w-auto px-8 py-2 border-2 border-white rounded-md hover:bg-white hover:text-[#84a98c] transition-all font-semibold active:scale-95"
          >
            Sign Out
          </button>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 flex flex-col items-center md:items-start">
          <h2 className="text-2xl md:text-4xl text-[#2f3e46] font-bold mb-4 text-center md:text-left">
            Welcome, <span className="text-[#84a98c]">{user?.user_metadata?.name || user?.email}</span>!
          </h2>
          
          <div className="w-full border-t border-gray-100 mt-4 pt-6">
            <p className="text-gray-600 text-center md:text-left">
              This is your protected user area.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Dashboard