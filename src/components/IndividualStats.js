import React, { useState } from "react";
import {
    BarChartOutlined,
    GithubOutlined,
    UserOutlined,
  } from "@ant-design/icons";
import ReactApexChart from 'react-apexcharts';
const IndividualStats = ({collaborator}) => {

    // const [state, setState] = useState({
	// 	series: [project.collaboratorStats[0].backlog,project.collaboratorStats[0].todo,project.collaboratorStats[0].inProgress,project.collaboratorStats[0].review],
	// });

	const options = {
		chart: {
			type: "donut",
		},
		colors: ["#10B981", "#375E83", "#259AE6", "#FFA70B","#AA3333","#6366F1"],
		labels: ["Backlog", "ToDo", "In-Progress", "Review", "Completed On Time",
		"Completed Late"],
		legend: {
			show: true,
			position: "bottom"
		},
		plotOptions: {
			pie: {
				donut: {
					size: "65%",
					background: "transparent",
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		responsive: [
			{
				breakpoint: 2600,
				options: {
					chart: {
						width: 380,
					},
				},
			},
			{
				breakpoint: 640,
				options: {
					chart: {
						width: 200,
					},
				},
			},
		],
	};

	console.log(collaborator);

    return (
        <div className="card">
            
            <div className="flex">
			<div className=" rounded-sm border w-4/5 border-stroke bg-white pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
				<div className="mb-3 justify-between gap sm:flex">
					<div className="flex items-center space-x-4">
						<h5 className="text-xl font-semibold text-black dark:text-white">
							{collaborator.username}
						</h5>
                        <img src={collaborator.avatar_url} className="rounded-3xl h-10 w-10"/>
					</div>
					<div>
						<div className="relative z-20 inline-block">
							<span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
								<svg
									width="10"
									height="6"
									viewBox="0 0 10 6"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
										fill="#637381"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
										fill="#637381"
									/>
								</svg>
							</span>
						</div>
					</div>
				</div>

				<div className="mb-6">
					<div id="chartThree" className="mx-auto flex justify-center">
						<ReactApexChart
							options={options}
							series={[collaborator.backlog, collaborator.todo, collaborator.inProgress, collaborator.review]}
							type="donut"
						/>
					</div>
				</div>
                <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
					<div className="w-full px-8 sm:w-1/2">
						<div className="flex w-full items-center">
							<span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#10B981]"></span>
							<p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
								<span> Backlog </span>
								<span> {collaborator.backlog} </span>
							</p>
						</div>
					</div>
					<div className="w-full px-8 sm:w-1/2">
						<div className="flex w-full items-center">
							<span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#375E83]"></span>
							<p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
								<span> ToDo </span>
								<span> {collaborator.todo} </span>
							</p>
						</div>
					</div>
					<div className="w-full px-8 sm:w-1/2">
						<div className="flex w-full items-center">
							<span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#259AE6]"></span>
							<p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
								<span> In-Progress </span>
								<span> {collaborator.inProgress} </span>
							</p>
						</div>
					</div>
					<div className="w-full px-8 sm:w-1/2">
						<div className="flex w-full items-center">
							<span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#FFA70B]"></span>
							<p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
								<span> Review </span>
								<span> {collaborator.review} </span>
							</p>
						</div>
					</div>
					<div className="w-full px-8 sm:w-1/2">
						<div className="flex w-full items-center">
							<span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#AA3333]"></span>
							<p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
								<span> On Time </span>
								<span> {collaborator.completed.onTime} </span>
							</p>
						</div>
					</div>
					<div className="w-full px-8 sm:w-1/2">
						<div className="flex w-full items-center">
							<span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6366F1]"></span>
							<p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
								<span> Late</span>
								<span> {collaborator.completed.late} </span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
        </div>
    );
};

export default IndividualStats;


