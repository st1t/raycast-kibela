import { useEffect, useState } from "react";
import { listNotes } from "./kibela-api";

type State = {
  notesAreLoading: boolean;
  notes: string[][];
};

export const useNotes = () => {
  const [{ notesAreLoading, notes }, setState] = useState<State>({
    notes: [],
    notesAreLoading: true,
  });

  useEffect(() => {
    listNotes()
      // .then(value => value || [])
      .then((notes) => setState((prev) => ({ ...prev, notes })))
      .finally(() => setState((prev) => ({ ...prev, notesAreLoading: false })));
  }, []);
  return { notes, notesAreLoading };
};
