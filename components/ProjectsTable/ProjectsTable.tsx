import {DataTable} from "mantine-datatable";
import {Badge, MantineColor} from "@mantine/core";

type Status = "In Progress" | "Cancelled" | "Completed" | "Pending" | string

const StatusBadge = ({status}: { status: Status }) => {
    let color: MantineColor = '';

    switch (status) {
        case 'In Progress':
            color = "blue"
            break;
        case 'Cancelled':
            color = "red"
            break;
        case 'Completed':
            color = "green"
            break;
        case 'Pending':
            color = "orange"
            break;
        default:
            color = "gray"
    }

    return (
        <Badge color={color} variant="filled" radius="sm">{status}</Badge>
    )
}

type ProjectItem = {
    "id": string;
    "name": string;
    "issued_date": string;
    "status": Status;
    "amount": string;
}

type ProjectsTableProps = {
    data?: ProjectItem[]
}
const ProjectsTable = ({data}: ProjectsTableProps) => {
    return (
        <DataTable
            verticalSpacing="sm"
            highlightOnHover
            columns={[
                {accessor: 'name'},
                {accessor: 'issued_date'},
                {
                    accessor: 'state',
                    render: ({status}) => <StatusBadge status={status}/>
                },
                {accessor: 'amount'}
            ]}
            records={data}
        />
    );
};

export default ProjectsTable
