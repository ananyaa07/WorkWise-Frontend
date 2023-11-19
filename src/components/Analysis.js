import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import Cards from "./Cards";
import { DragDropContext } from "react-beautiful-dnd";
import ColumnsList from "./ColumnsList";
import axios from "axios";
import Column from "./Column";
import { UserContext } from "../utils/contexts/User.js";
import { useContext } from "react";

import { Spin } from "antd";
import Project from "../components/Dashboard/Pages/Project.js";
import {
  RollbackOutlined,
  GithubOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Dropdown,
  message,
  Space,
  Tooltip,
  Avatar,
} from "antd";
import IndividualStats from "./IndividualStats.js";

const handleMenuClick = (e) => {
  console.log(e);
};

const Analysis = () => {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form] = Form.useForm();
  const params = useParams();
  const { baseUrl, user } = useContext(UserContext);
  const [isOwner, setIsOwner] = useState(false);
  const [project, setProject] = useState({});
  const [collaborators, setCollaborators] = useState([]);

  const getProject = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${params.section}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      setProject(response.data.project);
      // console.log(response.data);
      setIsOwner(response.data.project.owner.username === user.username);
      setCollaborators(response.data.project.collaborators);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const items = collaborators.map((collaborator) => ({
    label: collaborator.username,
    key: collaborator.id,
    icon: (
      <Avatar
        size={20}
        src={collaborator.avatar_url}
        className="flex items-center justify-center"
      />
    ),
  }));

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  useEffect(() => {
    getProject();
  }, []);

  const getProjectStats = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/projects/stats?projectName=${encodeURIComponent(
          project.name
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      // console.log(res.data.projects);
      setProjects(res.data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (project.name) getProjectStats();
  }, [project]);

  return (
    <>
      <div className=" overflow-auto bg-[#F3F4F8] h-[100vh] w-[max(calc(100%-300px),67vw)] absolute right-0">
        <ColumnsList />
        {project.name ? (
          <div className="flex justify-between ml-5 items-center mb-5">
            <div className="flex space-x-4 items-center">
              <div className=" whitespace-nowrap title text-3xl font-semibold  font-title ">
                {project.name}
              </div>
              <div className="ml-4 text-3xl mb-1">
                <a
                  href={`https://github.com/${project.owner.username}/${project.name}`}
                >
                  <GithubOutlined></GithubOutlined>
                </a>
              </div>
            </div>

            <div className="flex space-x-5 items-center">
              <Link to={`/kanban/${params.section}`}>
                <RollbackOutlined className="border px-1 py-1 border-gray-400 rounded-md" />
              </Link>

              <Dropdown.Button
                className="my-5"
                onClick={() => {
                  if (!isOwner) return;
                  setOpen(true);
                }}
                menu={menuProps}
                placement="bottom"
                icon={<UserOutlined />}
                style={{ marginRight: "2rem" }}
              >
                {isOwner ? "Add Collaborator" : "Collaborators"}
              </Dropdown.Button>
            </div>
          </div>
        ) : (
          <div className="title ml-6 mb-8 text-3xl font-semibold font-title">
            <Spin />
          </div>
        )}
        <div>
          {/* {console.log(projects[0])} */}
          {projects[0] ? (
            <Project key={projects[0]._id} project={projects[0]} />
          ) : (
            <Spin />
          )}
        </div>
      </div>
    </>
  );
};
export default Analysis;
