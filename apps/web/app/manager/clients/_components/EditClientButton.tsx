"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PencilIcon } from "lucide-react";

interface EditClientButtonProps {
    clientId: string;
}

export function EditClientButton({ clientId }: EditClientButtonProps) {
    return (
        <Link href={`/manager/clients/${clientId}/edit`}>
            <Button variant="ghost" size="icon">
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Edit Client</span>
            </Button>
        </Link>
    );
}
