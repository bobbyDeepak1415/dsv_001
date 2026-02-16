import React, { useEffect, useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

const UserForm = ({ fields, initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!fields?.length) return;

    const initialValues = {};

    fields.forEach((field) => {
      initialValues[field.name] = initialData?.[field.name] ?? "";
    });

    setFormData(initialValues);
  }, [fields, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      if (field.required && !value) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = "Invalid email format";
        }
      }

      if (field.name === "phone" && value) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value)) {
          newErrors[field.name] = "Phone number must be 10 digits";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ mt: 1 }}>
        {fields.map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            value={formData[field.name] ?? ""}
            onChange={handleChange}
            required={field.required}
            error={!!errors[field.name]}
            helperText={errors[field.name] || ""}
            fullWidth
          />
        ))}

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </Button>
      </Stack>
    </form>
  );
};

export default UserForm;
