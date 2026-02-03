"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseQueryKeys } from "@/lib/supabase/queries";
import { toast } from "sonner";
import EntryEditor from "@/components/budget/EntryEditor";
import TypeToConfirmDialog from "@/components/common/TypeToConfirmDialog";
import { deleteTemplateAction, renameTemplateAction } from "@/app/actions/templates";

interface TemplateHeaderActionsProps {
  templateId: string;
  templateName: string;
}

export default function TemplateHeaderActions({
  templateId,
  templateName
}: TemplateHeaderActionsProps) {
  const { t } = useTranslation();
  const [openRename, setOpenRename] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleRename = async (values: { name: string }) => {
    startTransition(async () => {
      const result = await renameTemplateAction(templateId, values.name);
      if (!result.ok) {
        toast.error(t("templates.renameError"));
        return;
      }
      toast.success(t("templates.renamed"));
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.template(templateId) });
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.templates });
    });
  };

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteTemplateAction(templateId);
      if (!result.ok) {
        toast.error(t("templates.deleteError"));
        return;
      }
      toast.success(t("templates.deleted"));
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.templates });
      router.push("/templates");
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-full" disabled={isPending}>
            {t("common.edit")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setOpenRename(true)}>
            {t("templates.rename")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => setOpenDelete(true)}>
            {t("templates.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EntryEditor
        open={openRename}
        onOpenChange={setOpenRename}
        title={t("templates.rename")}
        initialValues={{ name: templateName }}
        onSave={(values) => handleRename({ name: values.name })}
      />

      <TypeToConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title={t("templates.deleteConfirmTitle")}
        description={t("templates.deleteConfirmDescription")}
        keyword={t("templates.deleteConfirmKeyword")}
        placeholder={t("templates.deleteConfirmPlaceholder")}
        confirmLabel={t("templates.delete")}
        onConfirm={handleDelete}
      />
    </>
  );
}
