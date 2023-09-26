import {ActionIcon, Group, Paper, PaperProps, Text} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import {IconDotsVertical} from "@tabler/icons-react";

type LanguageTableProps = {
    data?: { id: string, language: string, users: number, users_percentage: number }[]
} & PaperProps

const LanguageTable = ({data, ...others}: LanguageTableProps) => {
    return (
        <Paper {...others}>
            <Group position="apart" mb="sm">
                <Text size="lg" fw={600}>Buildings</Text>
                <ActionIcon>
                    <IconDotsVertical size={18}/>
                </ActionIcon>
            </Group>
            <DataTable
                verticalSpacing="sm"
                highlightOnHover
                columns={[
                    {accessor: 'building_name'},
                ]}
                records={data}
            />
        </Paper>
    );
};

export default LanguageTable
