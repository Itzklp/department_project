import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ShieldAlert, Trash2, Power, PowerOff } from "lucide-react";
import config from "../config";
import ConfirmationModal from "../components/common/ConfirmationModal";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state for deletion
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await res.json();
      if (result.success) {
        setUsers(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setUsers(users.map(u => u._id === userId ? { ...u, status: result.data.status } : u));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setUsers(users.map(u => u._id === userId ? { ...u, role: result.data.role } : u));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/v1/admin/users/${userToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setUsers(users.filter(u => u._id !== userToDelete));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading users...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 mt-1">Control system access and assign roles for the department.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="p-4 font-semibold">User Details</th>
                <th className="p-4 font-semibold">System Role</th>
                <th className="p-4 font-semibold">Login Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  {/* USER INFO */}
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>

                  {/* ROLE DROPDOWN */}
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    >
                      <option value="faculty">Faculty</option>
                      <option value="hod">HOD (Head of Dept)</option>
                      <option value="admin">System Admin</option>
                    </select>
                  </td>

                  {/* STATUS TOGGLE */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(user._id, user.status)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                        user.status === "ACTIVE" 
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      }`}
                    >
                      {user.status === "ACTIVE" ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                      {user.status === "ACTIVE" ? "Active" : "Suspended"}
                    </button>
                  </td>

                  {/* DELETE ACTION */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setUserToDelete(user._id);
                        setIsModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove Login Access"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusing your ConfirmationModal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Revoke Login Access?"
        message="Are you sure you want to delete this user? They will no longer be able to log in, but their public faculty profile and academic records will remain safe."
      />
    </div>
  );
};

export default ManageUsers;