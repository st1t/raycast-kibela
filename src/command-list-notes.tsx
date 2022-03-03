import {Action, ActionPanel, List} from "@raycast/api";
import {useNotes} from "./useNotes";

export default function CommandListNotes() {
    const {notes, notesAreLoading} = useNotes();
    return (
        <List isLoading={notesAreLoading}>
            {notes.map(value => (
                <List.Item
                    key={value[0]}
                    icon={{source: {light: "lion-icon.png", dark: "lion-icon.png"}}}
                    title={"【" + value[3] + "】" + value[1]}
                    actions={
                        <ActionPanel>
                            <Action.OpenInBrowser url={value[2]}/>
                        </ActionPanel>
                    }
                />
            ))}
        </List>
    );
}
