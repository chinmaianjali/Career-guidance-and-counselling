import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

// Placeholder image URL
const placeholderImage =
  "https://via.placeholder.com/300x200.png?text=No+Image";

const SchoolAdminPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error message
  const [selectedStudent, setSelectedStudent] = useState(null); // State for selected student

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const schoolName = user?.School;

        if (!schoolName) {
          setError("No school associated with the School Admin.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/api/v1/user/getusersbyschool/${schoolName}`
        );

        const jobSeekers = response.data.users.filter(
          (student) => student.role === "Job Seeker"
        );

        setStudents(jobSeekers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Error fetching students. Please try again.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  const handleCardClick = (student) => {
    setSelectedStudent(student);
  };

  const handleBackClick = () => {
    setSelectedStudent(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (selectedStudent) {
    return (
      <div>
        <button onClick={handleBackClick} style={backButtonStyle}>
          Back to List
        </button>
        <div style={detailCardStyle}>
          <img
            src={selectedStudent.image || placeholderImage}
            alt={selectedStudent.name}
            style={detailImageStyle}
          />
          <h2>{selectedStudent.name}</h2>
          <p>
            <strong>Email:</strong> {selectedStudent.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedStudent.phone}
          </p>
          <p>
            <strong>Address:</strong> {selectedStudent.address}
          </p>
          <p>
            <strong>School:</strong> {selectedStudent.School}
          </p>
          <p>
            <strong>Niches:</strong>
          </p>
          <ul>
            <li>{selectedStudent.niches?.firstNiche || "N/A"}</li>
            <li>{selectedStudent.niches?.secondNiche || "N/A"}</li>
            <li>{selectedStudent.niches?.thirdNiche || "N/A"}</li>
          </ul>
          <p>
            <strong>Social Marks:</strong> {selectedStudent.Social_Marks || "N/A"}
          </p>
          <p>
            <strong>English Marks:</strong> {selectedStudent.English_Marks || "N/A"}
          </p>
          <p>
            <strong>Science Marks:</strong> {selectedStudent.Science_Marks || "N/A"}
          </p>
          <p>
            <strong>Mathematics Marks:</strong> {selectedStudent.Mathematics_Marks || "N/A"}
          </p>
          <p>
            <strong>Overall Academic Details:</strong> {selectedStudent.academicDetails_Overall || "N/A"}
          </p>
          <p>
            <strong>Hobbies:</strong> {selectedStudent.hobbies || "N/A"}
          </p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return <p>No students found for {user?.School}.</p>;
  }

  return (
    <div>
      <h1>Job Seekers from {user?.School}</h1>
      <div style={gridStyle}>
        {students.map((student) => (
          <div
            key={student._id}
            style={cardStyle}
            onClick={() => handleCardClick(student)}
          >
            <img
              src={student.image || placeholderImage}
              alt={student.name}
              style={imageStyle}
            />
            <h3>{student.name}</h3>
            <p>{student.School}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Define styles as constants
const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  margin: "10px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  maxWidth: "300px",
  cursor: "pointer",
  textAlign: "center",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
  padding: "20px",
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "10px",
};

const detailCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
  margin: "auto",
  textAlign: "center",
};

const detailImageStyle = {
  width: "100%",
  height: "300px",
  objectFit: "cover",
  borderRadius: "10px",
};

const backButtonStyle = {
  margin: "10px",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
};

export default SchoolAdminPage;
