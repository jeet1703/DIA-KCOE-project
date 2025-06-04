import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { BASE_URL } from "../Config";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/dashboard/drdoone/`)
      .then((res) => res.json())
      .then((data) => {
        // add id field to each project (if not already present)
        const projectsWithId = data.map((proj, index) => ({
          ...proj,
          id: index + 1,
          comments: proj.comments || "",
        }));
        setProjects(projectsWithId);
      })
      .catch((err) => console.error("Failed to fetch projects:", err));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, status: newStatus } : proj))
    );

    const project = projects.find((p) => p.id === id);
    if (!project) return;

    fetch(`${BASE_URL}/api/dashboard/drdoone/update/${project.referenceNo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    }).catch((err) => console.error("Status update failed:", err));
  };

  const handleCommentsChange = (id, newComment) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, comments: newComment } : proj))
    );
  };

  const handleSendComment = (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project || project.comments.trim() === "") {
      alert("Please enter a comment before sending.");
      return;
    }

    fetch(`${BASE_URL}/api/dashboard/drdoone/update/${project.referenceNo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments: project.comments }),
    })
      .then((res) => res.json())
      .then(() => {
        alert(`Comment sent for project "${project.nomenclature}":\n${project.comments}`);
        setProjects((prev) =>
          prev.map((proj) => (proj.id === id ? { ...proj, comments: "" } : proj))
        );
      })
      .catch((err) => console.error("Comment update failed:", err));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="p-8 flex-grow max-w-full overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4 text-[#02447C]">
          Submitted DIA-KCOE Project Records (drdoone)
        </h2>
        <table className="w-full border text-sm bg-white shadow table-auto min-w-[1100px]">
          <thead className="bg-[#02447C] text-white">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Nomenclature</th>
              <th className="border p-2">Academia/Institute PI Name</th>
              <th className="border p-2">Coordinating Lab Scientist</th>
              <th className="border p-2">Research Vertical</th>
              <th className="border p-2">Cost in Lakhs</th>
              <th className="border p-2">Sanctioned Date</th>
              <th className="border p-2">Duration & PDC</th>
              <th className="border p-2">Lab/Contact Person</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Comments</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-blue-50">
                <td className="border p-2">{project.id}</td>
                <td className="border p-2">{project.nomenclature}</td>
                <td className="border p-2">{project.piName}</td>
                <td className="border p-2">{project.coordinatingScientist}</td>
                <td className="border p-2">{project.researchVertical}</td>
                <td className="border p-2">{project.costInLakhs || project.cost}</td>
                <td className="border p-2">{project.sanctionedDate}</td>
                <td className="border p-2">{project.durationPDC || project.durationAndPDC}</td>
                <td className="border p-2">{project.labContactPerson || project.labContact}</td>
                <td className="border p-2">
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project.id, e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="In Process">In Process</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={project.comments}
                      onChange={(e) => handleCommentsChange(project.id, e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Add comment"
                    />
                    <button
                      onClick={() => handleSendComment(project.id)}
                      className="bg-[#02447C] text-white px-3 rounded hover:bg-[#035a8c] transition"
                    >
                      Send
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
