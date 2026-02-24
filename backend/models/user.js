// Simple user object for reference (use an ORM for real projects)
class User {
  constructor(id, email, role) {
    this.id = id;
    this.email = email;
    this.role = role;
  }
}

module.exports = User;
