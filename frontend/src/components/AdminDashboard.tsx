import { useEffect, useState } from "react";
import { fetchUsers, addUser, deleteUser, User } from "../api/client";

export function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        full_name: "",
        role: "user",
    });

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError("Failed to load users");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addUser(newUser);
            setIsAdding(false);
            setNewUser({ email: "", password: "", full_name: "", role: "user" });
            loadUsers();
        } catch (err) {
            alert("Failed to add user");
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(userId);
            loadUsers();
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    return (
        <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3>Admin Dashboard - User Management</h3>
                <button onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? "Cancel" : "Add User"}
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {isAdding && (
                <form onSubmit={handleAddUser} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <label>Email: </label>
                        <input
                            type="email"
                            required
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <label>Password: </label>
                        <input
                            type="password"
                            required
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <label>Full Name: </label>
                        <input
                            type="text"
                            value={newUser.full_name}
                            onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                        />
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <label>Role: </label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit">Create User</button>
                </form>
            )}

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ textAlign: "left" }}>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Full Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.full_name}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(user.id)} style={{ backgroundColor: "#ff4444", color: "white", padding: "4px 8px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
