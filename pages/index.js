import { Card, Center, Paper, Text, Title, rem, } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { parseValidInt } from "@/lib/shared/data-formatters";
import {AuthLayout} from "@/layout";
import {useMediaQuery} from "@mantine/hooks";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const isStaff = session?.user?.role === "staff";
  const isUser = session?.user?.role === "tenant";
  const isMerchant = session?.user?.role === "merchant";

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated") {
      console.log("Authenticated successfully");
      let next_url = "/dashboard";

      if (isUser) {
        next_url = "/dashboard/tenant";
      }

      if (isMerchant) {
        next_url = "/dashboard/default";
      }

      console.log("Going to this URL: ", next_url);
      router.replace(next_url);
      return;
    } else {
      router.push("/auth/signin");
    }

  }, [status, router, isMerchant, isUser]);

  return (

        <AuthLayout>
          <Title fz="xl" ta="center">
              Properties Management
          </Title>
        <Paper shadow="xl" radius="md" p="xl" mt={15} sx={{width: rem(mobile_match ? 360 : 420)}}>
            <Text fontSize="2xl">
              Getting things ready for you...
            </Text>
        </Paper>
        </AuthLayout>

  );
}

export async function getServerSideProps(context) {
  return { props: {} };
}
