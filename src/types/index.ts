export type Member = {
  id: string;
  name: string;
  role: string;
  bio: string;
  year: string;
  department?: string;
  imageUrl?: string;
};

export type NavItem = {
  href: string;
  label: string;
};

export type JoinFormData = {
  name: string;
  email: string;
  year: string;
  department: string;
  message?: string;
};
