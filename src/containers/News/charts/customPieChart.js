import React, {Component} from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie } from "recharts";
import Legend from "recharts/es6/component/Legend";

const data = [{ name: "network 1", value: 2 }, { name: "network 3", value: 4 }];

export default class extends Component {
    render() {
        const {datas, width, height, colors} = this.props;
        return (
            <ResponsiveContainer width="100%" height={250}>
                <PieChart height={250}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({
                                    cx,
                                    cy,
                                    midAngle,
                                    innerRadius,
                                    outerRadius,
                                    value,
                                    index
                                }) => {
                            const RADIAN = Math.PI / 180;
                            // eslint-disable-next-line
                            const radius = 25 + innerRadius + (outerRadius - innerRadius);
                            // eslint-disable-next-line
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            // eslint-disable-next-line
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                            return (
                                <text
                                    x={x}
                                    y={y}
                                    fill="#8884d8"
                                    textAnchor={x > cx ? "start" : "end"}
                                    dominantBaseline="central"
                                >
                                    {data[index].name} ({value})
                                </text>
                            );
                        }}
                    />
                    <Tooltip/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        );
    }
}