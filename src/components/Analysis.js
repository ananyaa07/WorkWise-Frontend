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
import {BarChartOutlined, GithubOutlined, UserOutlined } from "@ant-design/icons";
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

const handleButtonClick = (e) => {
  message.info("Click on left button.");
  console.log("click left button", e);
};
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
  let cardsData = [[], [], [], []];
  const columnTitles = ["Backlog", "To Do", "In Progress", "Review"];
  const Columns = ["backlog", "todo", "in-progress", "review"];
  const [elements, setElements] = useState(cardsData);
  const [project, setProject] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [invitee, setInvitee] = useState("");
 

  const getProjects = async () => {
    const res = await axios.get(`${baseUrl}/projects/cards`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    });
    // console.log(res.data.projects);
    setProjects(res.data.projects);
  };

  useEffect(() => {
    getProjects();
  }, []);


  const getProjectCards = async () => {
    try {
      const promises = Columns.map(async (column, i) => {
        const res = await axios.get(
          `${baseUrl}/projects/${params.section}/cards/${column}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        cardsData[i] = res.data.cards;
      });

      await Promise.all(promises);
      // console.log(cardsData);
      setElements(cardsData);
      setIsLoading(false); // Mark loading as complete
    } catch (error) {
      console.error("Error fetching project cards:", error);
      setIsLoading(false); // Mark loading as complete in case of an error
    }
  };

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
      console.log(response.data.project);
      setIsOwner(response.data.project.owner.username === user.username);
      setCollaborators(response.data.project.collaborators);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const updateProjectCards = async (id, categoryIndex) => {
    // console.log("update called");
    try {
      const response = await axios.patch(
        `${baseUrl}/cards/${id}`,
        {
          category: Columns[categoryIndex],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating project card:", error);
    }
  };

  const getAllCollaborators = async () => {
    try {
      await axios.get(`${baseUrl}/projects/${params.section}/collaborators`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
    } catch (error) {
      console.error("Error fetching project collaborators:", error);
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
    getProjectCards();
  }, [project]);

  useEffect(() => {
    getProject();
    getAllCollaborators();
  }, []);

  const removeFromList = (list, index) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
  };

  const addToList = (list, index, element) => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const listCopy = { ...elements };
    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );

    updateProjectCards(removedElement._id, result.destination.droppableId);

    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];

    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );
    setElements(listCopy);
  };

  const handleOk = async () => {
    if (!invitee) {
      message.error("Enter a valid username or click cancel");
      return;
    }

    try {
      setIsAdding(true);
      const response = await axios.post(
        `${baseUrl}/projects/${params.section}/collaborators`,
        {
          collaboratorUsernames: [invitee], // Pass the invitee username as an array
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (response.status === 200) {
        message.success(`Invite sent to ${invitee}`);
        setOpen(false);
        form.resetFields();
        setInvitee("");
        setIsAdding(false);
      } else {
        setIsAdding(false);
        message.error("Failed to add collaborator");
      }
    } catch (error) {
      setIsAdding(false);
      console.error("Error adding collaborator:", error);
      message.error("Failed to add collaborator");
    }
  };
  const handleCancel = async () => {
    form.resetFields();
    setOpen(false);
    setInvitee("");
  };


  const projectArray = [project];
    console.log(project._id);
    console.log(params.section)
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
                <BarChartOutlined className="border px-1 py-1 border-gray-400 rounded-md"/>
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
                    {projects?.map((project) => {
                    if (project.project._id == params.section) {
                        
                        return <Project key={project.id} project={project} />;
                    }
                    return null;
                })}
        </div>
        </div>
        
    </>
  );
};
export default Analysis;
