import { Pagination, Group, Text } from "@mantine/core";
import { useState } from "react";

function PaginationLinks({ paginatedData, onLinkClicked }) {
  const [activePage, setPage] = useState(1);

  function changePage(page) {
    setPage(page);
    onLinkClicked(paginatedData?.links[page]?.url);
  }

  return (
    paginatedData && (
      <Group position="apart" mb="md" mt="md">
            <Text >Showing {paginatedData?.from ?? 0} to {paginatedData?.to ?? 0} of {" " + paginatedData?.total ?? 0}</Text>
            <Pagination
            total={paginatedData?.last_page ?? 0}
            page={activePage}
            onChange={changePage}
          />
      </Group>
      
    )
  );
}

export default PaginationLinks;
