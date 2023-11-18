import React, { useEffect } from 'react'
import Column from './Column';
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { Avatar } from "antd";
import {
	SearchOutlined,
	CalendarOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { UserContext } from "../utils/contexts/User.js";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Tooltip } from 'antd';

const handleMenuClick = (e) => {
	message.info('Click on menu item.');
	console.log('click', e);
  };

const items = [
	{
	  label: '1st menu item',
	  key: '1',
	  icon: <UserOutlined />,
	},
	{
	  label: '2nd menu item',
	  key: '2',
	  icon: <UserOutlined />,
	},
];

const menuProps = {
	items,
	onClick: handleMenuClick,
  };

export default function ColumnsList() {
	
	const { user } = useContext(UserContext);
  return (
    <div className="h-16 bg-white flex items-center px-4 mb-5 justify-between">
      <div className="text-xl font-bold font-title">
        Welcome back, {user.fullName} 👋
      </div>
      <div className="others flex items-center">
        <SearchOutlined className="mr-4" />
        <span className="mr-4 border px-2 py-2 border-gray-400 rounded-md text-sm">{dayjs().format('DD-MM-YYYY')}</span>
        <Link to="/settings/profile">
          <Avatar
            size={40}
            src={user.picture}
            className="flex items-center justify-center"
          />
        </Link>
      </div>
	  
    </div>
  );
}
    