import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth, getErrorMessage } from "../context/authContext";
import API from "../services/api";
import "./Profile.css";

function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [details, setDetails] = useState({ name: user.name, email: user.email });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [stats, setStats] = useState(null);

  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    API.get("/users/stats")
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  const handleDetailsSubmit = async (event) => {
    event.preventDefault();
    setIsSavingDetails(true);

    try {
      const { data } = await API.put("/users/profile", {
        name: details.name.trim(),
        email: details.email.trim(),
      });

      setUser(data);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update your profile."));
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwords.newPassword.length < 8) {
      toast.error("Your new password must be at least 8 characters.");
      return;
    }

    setIsSavingPassword(true);

    try {
      await API.put("/users/password", passwords);

      setPasswords({ currentPassword: "", newPassword: "" });
      toast.success("Password updated.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update your password."));
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      await API.delete("/users/profile");

      // The server already cleared the cookie; drop the local user too.
      await logout();
      toast.success("Your account has been deleted.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete your account."));
      setIsDeleting(false);
    }
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <main className="container profile">
      <header className="profile-header">
        <span className="profile-eyebrow">Account</span>
        <h1>{user.name}</h1>
        <p className="profile-meta">
          {user.email} · member since {memberSince}
        </p>
      </header>

      {stats && (
        <section className="profile-stats" aria-label="Task summary">
          <div className="stat">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In progress</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </section>
      )}

      <section className="profile-card">
        <h2>Profile details</h2>

        <form onSubmit={handleDetailsSubmit}>
          <div className="form-group">
            <label htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              type="text"
              value={details.name}
              onChange={(event) =>
                setDetails((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              value={details.email}
              onChange={(event) =>
                setDetails((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
          </div>

          <button type="submit" className="btn" disabled={isSavingDetails}>
            {isSavingDetails ? "Saving…" : "Save changes"}
          </button>
        </form>
      </section>

      <section className="profile-card">
        <h2>Change password</h2>

        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="current-password">Current password</label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={(event) =>
                setPasswords((current) => ({
                  ...current,
                  currentPassword: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={(event) =>
                setPasswords((current) => ({
                  ...current,
                  newPassword: event.target.value,
                }))
              }
              required
            />
            <p className="auth-hint">At least 8 characters.</p>
          </div>

          <button type="submit" className="btn" disabled={isSavingPassword}>
            {isSavingPassword ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>

      <section className="profile-card profile-danger">
        <h2>Delete account</h2>
        <p className="profile-danger-copy">
          This permanently removes your account and every task you have created.
          It cannot be undone.
        </p>

        {confirmDelete ? (
          <div className="profile-danger-actions">
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Yes, delete everything"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setConfirmDelete(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setConfirmDelete(true)}
          >
            Delete my account
          </button>
        )}
      </section>
    </main>
  );
}

export default Profile;
