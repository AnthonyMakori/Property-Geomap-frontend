import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Card } from "@mantine/core";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
        router.replace("/auth/signin");
  }, [router]);

  return (
    <section>
    </section>
  );
}