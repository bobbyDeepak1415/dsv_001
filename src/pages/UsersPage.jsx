import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
} from "@mui/material";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";
import { userFields } from "../config/userFormSchema";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      if (editingUser) {
        const updated = await updateUser(editingUser.id, formData);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...updated } : u)),
        );
      } else {
        const newUser = await createUser(formData);
        setUsers((prev) => [...prev, { ...newUser, id: Date.now() }]);
      }

      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Button variant="contained" onClick={handleOpenCreate}>
        Add User
      </Button>

      {loading ? (
        <CircularProgress sx={{ mt: 3 }} />
      ) : (
        <UserTable
          users={users}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={modalOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>

        <DialogContent>
          <UserForm
            fields={userFields}
            initialData={editingUser || {}}
            onSubmit={handleSubmit}
            loading={saving}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersPage;
