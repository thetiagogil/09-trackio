"use client";

import { Loader2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  DEFAULT_CATEGORIES,
  TRACKER_FIELD_LIMITS,
} from "@/lib/trackers";
import type { Tracker, TrackerFormInput } from "@/types/trackio";

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
  category: DEFAULT_CATEGORIES[0],
  username: "",
  notes: "",
};

export function TrackerForm({ editing, open, ...props }: TrackerFormProps) {
  const formKey = `${open ? "open" : "closed"}-${editing?.id ?? "new"}`;

  return (
    <TrackerFormContent
      editing={editing}
      key={formKey}
      open={open}
      {...props}
    />
  );
}

function TrackerFormContent({
  categories,
  editing,
  onClose,
  onSubmit,
  open,
  pending,
}: TrackerFormProps) {
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

  const categoryOptions = useMemo(() => {
    const unique = new Set([...DEFAULT_CATEGORIES, ...categories]);

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [categories]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      category: customCategory.trim() || form.category,
    });
  };

  return (
    <Modal
      onClose={onClose}
      open={open}
      title={editing ? "Edit tracker" : "New tracker"}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="tracker-title">Title</Label>
          <Input
            autoFocus
            id="tracker-title"
            maxLength={TRACKER_FIELD_LIMITS.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Letterboxd"
            required
            value={form.title}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tracker-url">URL</Label>
          <Input
            id="tracker-url"
            maxLength={TRACKER_FIELD_LIMITS.url}
            onChange={(event) =>
              setForm((current) => ({ ...current, url: event.target.value }))
            }
            placeholder="https://letterboxd.com/you"
            required
            type="url"
            value={form.url}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tracker-category">Category</Label>
            <select
              className="h-11 w-full rounded-sm border-2 border-input bg-background/70 px-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              id="tracker-category"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              value={form.category}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tracker-custom-category">New category</Label>
            <Input
              id="tracker-custom-category"
              maxLength={TRACKER_FIELD_LIMITS.category}
              onChange={(event) => setCustomCategory(event.target.value)}
              placeholder="optional"
              value={customCategory}
            />
          </div>
        </div>

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
            placeholder="@you"
            value={form.username ?? ""}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tracker-notes">Notes</Label>
          <Textarea
            id="tracker-notes"
            maxLength={TRACKER_FIELD_LIMITS.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
            placeholder="Private context for this tracker"
            value={form.notes ?? ""}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {editing ? "Save tracker" : "Add tracker"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
