export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const getInitials = (name) => {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  );
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getStatusColor = (status) => {
  const colors = {
    todo: "bg-yellow-100 text-yellow-800 border-yellow-300",
    in_progress: "bg-blue-100 text-blue-800 border-blue-300",
    done: "bg-green-100 text-green-800 border-green-300",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
};

export const getRoleColor = (role) => {
  const colors = {
    admin: "bg-purple-100 text-purple-800 border-purple-300",
    project_admin: "bg-pink-100 text-pink-800 border-pink-300",
    member: "bg-blue-100 text-blue-800 border-blue-300",
  };
  return colors[role] || "bg-gray-100 text-gray-800 border-gray-300";
};

export const truncate = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};
