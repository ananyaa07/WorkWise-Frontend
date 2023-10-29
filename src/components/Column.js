import React from "react";
import { useState } from "react";
import { Button, Modal } from "antd";
import { Form, Input, InputNumber } from "antd";
import { BsPlus } from "react-icons/bs";
import { FiMoreHorizontal } from "react-icons/fi";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useContext } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Image } from "antd";
import { Select } from "antd";
import { UserContext } from "../utils/contexts/User.js";
import KanbanSection from "./KanbanSection.js";

export default function Column({
  index,
  data,
  setElements,
  title,
  collaborators,
}) {
  const params = useParams();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priority, setPriority] = useState("low");
  const Columns = ["backlog", "todo", "in-progress", "review"];
  const [tags, setTags] = useState([]);
  const inde = parseInt(index);
  const [imgUrl, setImgUrl] = useState("");
  const { baseUrl } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [assignees, setAssignees] = useState([]);

  const dateFormat = "DD/MM/YYYY";

  const handleTagChange = (newTags) => {
    setTags(newTags);
  };

  const onChange = (value) => {
    setPriority(value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  let cardsData = [[], [], [], []];

  const getProjectCards = async () => {
    for (let i = 0; i < Columns.length; i++) {
      const res = await axios.get(
        `${baseUrl}/projects/${params.section}/cards/${Columns[i]}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      cardsData[i] = res.data.cards;
    }
    setElements(cardsData);
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    let res = await axios.post(
      `${baseUrl}/projects/` + params.section + "/cards",
      {
        title: values.title,
        description: values.description,
        priority,
        startDate: dayjs(values.startDate).format(dateFormat),
        tags: tags,
        assignees: assignees,
        category: Columns[inde],
        imageUrl: imgUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      }
    );

    console.log(dayjs(values.startDate).format(dateFormat));
    setIsLoading(false);
    setIsModalOpen(false);
    getProjectCards();
  };

  return (
    <>
      <div className="w-[88%] bg-white rounded-lg ml-4 mr-4">
        <div className="flex items-center justify-between p-2">
          <div className="col_name font-semibold p-2 font-body">{title}</div>
          <div className="icons flex flex-wrap justify-evenly">
            {/* <div className="first mr-2 p-1">
							<FiMoreHorizontal className="text-[#768396]" />
						</div> */}
            <div className="second bg-[#D8DAFF] rounded-md p-1">
              <BsPlus
                fill="#6772FE"
                onClick={showModal}
                style={{ cursor: "pointer", transition: "fill 0.3s" }}
                onMouseEnter={(e) => (e.target.style.fill = "#484daf")}
                onMouseLeave={(e) => (e.target.style.fill = "#6772FE")}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        destroyOnClose={true}
        title="New Issue"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          className="my-8"
        >
          <Form.Item
            label="Issue Title"
            name="title"
            rules={[{ required: true, message: "Please enter a valid title." }]}
          >
            <Input placeholder="Enter A Title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: false }]}
          >
            <Input placeholder="Enter a valid Description" />
          </Form.Item>
          <Form.Item
            label="Assign Issue To"
            name="assignees"
            rules={[{ required: false }]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Select assignees"
              onChange={(value) => setAssignees(value)}
            >
              {collaborators.map((collaborator) => (
                <Select.Option
                  key={collaborator.id}
                  value={collaborator.username}
                >
                  {collaborator.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Tag" name="tags" rules={[{ required: false }]}>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              value={tags}
              onChange={handleTagChange}
              placeholder="Labels of Issue"
              className="bg-white"
            ></Select>
          </Form.Item>

          <Form.Item className=" flex justify-end px-10">
            <Button htmlType="submit" className="" loading={isLoading}>
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
