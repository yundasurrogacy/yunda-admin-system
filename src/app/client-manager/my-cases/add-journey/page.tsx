

"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ManagerLayout from "@/components/manager-layout";
import AddJourneyForm from "./AddJourneyForm";

const AddJourneyPage = () => {
  return (
    <ManagerLayout>
      <Suspense>
        <AddJourneyForm />
      </Suspense>
    </ManagerLayout>
  );
};

export default AddJourneyPage;