"use client";

import { Loader2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Modal } from "@/shared/components/ui/modal";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  DEFAULT_CATEGORIES,
  TRACKER_FIELD_LIMITS,
} from "@/features/trackers/constants";
import type { Tracker, TrackerFormInput } from "@/features/trackers/types";

type TrackerFormProps = {
  open: boolean;
  editing: Tracker | null;
  categories: string[];
  pending: boolean;
  onClose: () => void;
  onSubmit: (input: TrackerFormInput) => void;
};

const emptyForm: TrackerFormInput = {
  title: "",
  url: "",
  category: "",
  username: "",
  notes: "",
};

export function TrackerForm({ editing, open, ...props }: TrackerFormProps) {
  const { categories, onClose, onSubmit, pending } = props;
  const [form, setForm] = useState<TrackerFormInput>(() =>
    editing
      ? {
          title: editing.title,
          url: editing.url,
          category: editing.category,
          username: editing.username ?? "",
          notes: editing.notes ?? "",
        }
      : emptyForm,
  );
  const [customCategory, setCustomCategory] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const categoryOptions = useMemo(() => {
    const unique = new Set([...DEFAULT_CATEGORIES, ...categories]);

    return Array.from(unique).map((category) => ({
      label: category,
      value: category,
    }));
  }, [categories]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const category = customCategory.trim() || form.category;

    if (!category) {
      setCategoryError("Choose a category or type a new one.");
      return;
    }

    onSubmit({
      ...form,
      category,
    });
  };

  return (
    <Modal
      onClose={onClose}
      open={open}
      title={editing ? "> Edit Tracker" : "> New Tracker"}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="tracker-title" required>
            Title
          </Label>
          <Input
            autoFocus
            id="tracker-title"
            maxLength={TRACKER_FIELD_LIMITS.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="e.g. AniList"
            required
            value={form.title}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tracker-url" required>
            URL
          </Label>
          <Input
            id="tracker-url"
            maxLength={TRACKER_FIELD_LIMITS.url}
            onChange={(event) =>
              setForm((current) => ({ ...current, url: event.target.value }))
            }
            placeholder="https://..."
            required
            type="url"
            value={form.url}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tracker-category" required>
            Category
          </Label>
          <Select
            id="tracker-category"
            aria-describedby={
              categoryError ? "tracker-category-error" : undefined
            }
            onValueChange={(value) => {
              setForm((current) => ({
                ...current,
                category: value,
              }));
              setCategoryError(null);
            }}
            options={categoryOptions}
            placeholder="Select category..."
            value={form.category}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tracker-custom-category">Or new category</Label>
          <Input
            id="tracker-custom-category"
            maxLength={TRACKER_FIELD_LIMITS.category}
            onChange={(event) => {
              setCustomCategory(event.target.value);
              setCategoryError(null);
            }}
            placeholder="Type a new category"
            value={customCategory}
          />
        </div>
        {categoryError ? (
          <Alert id="tracker-category-error" tone="error">
            {categoryError}
          </Alert>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="tracker-username">Username or profile label</Label>
          <Input
            id="tracker-username"
            maxLength={TRACKER_FIELD_LIMITS.username}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                username: event.target.value,
              }))
            }
            placeholder="@me"
            value={form.username ?? ""}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tracker-notes">Notes / Context</Label>
          <Textarea
            id="tracker-notes"
            maxLength={TRACKER_FIELD_LIMITS.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
            placeholder="Private context for this tracker"
            rows={3}
            value={form.notes ?? ""}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {editing ? "Save" : "Add Tracker"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
