import { getPreferenceValues } from "@raycast/api";
import { name } from "../package.json";
import gql from "graphql-tag";
import { print as printGql } from "graphql/language/printer";
import fetch from "node-fetch";

const { team: TEAM, token: TOKEN, query_limit: QUERY_LIMIT } = getPreferenceValues();
const API_ENDPOINT = `https://${TEAM}.kibe.la/api/v1`;
const USER_AGENT = `${name}`;

// https://XXXX.kibe.la/api/console
const query = gql`
query GetNotes {
  notes(first: ${QUERY_LIMIT}, orderBy: {field: CONTENT_UPDATED_AT, direction: DESC}) {
    edges {
      node {
        id
        title
        url
        folders(first: 1) {
          edges {
            node {
              name
            }
          }
        }
      }
    }
  }
}`;

type KibelaResponse = {
  data: {
    notes: {
      edges: {
        node: {
          id: string;
          title: string;
          url: string;
          folders: {
            edges: [
              {
                node: {
                  name: string;
                };
              }
            ];
          };
        };
      }[];
    };
  };
};

export async function listNotes() {
  return fetch(API_ENDPOINT, {
    method: "POST", // [required]
    redirect: "follow",
    headers: {
      Authorization: `Bearer ${TOKEN}`, // [required]
      "Content-Type": "application/json", // [required]
      Accept: "application/json", // [required]
      "User-Agent": USER_AGENT, // [recommended]
    },
    body: JSON.stringify({
      query: printGql(query),
      variables: {},
    }),
  }).then((response) => {
    if (!response.ok) {
      const body = response.text();
      throw new Error(`not ok: ${response.statusText}\n${body}`);
    }
    return response.json().then((body) => {
      const kibelaResponse = JSON.parse(JSON.stringify(body)) as KibelaResponse;
      const notes: string[][] = [];
      kibelaResponse.data.notes.edges.forEach((value) => {
        let folderName = "";
        if (value.node.folders.edges.length > 0) {
          folderName = value.node.folders.edges[0].node.name;
        } else {
          folderName = "none";
        }
        notes.push([value.node.id, value.node.title, value.node.url, folderName]);
      });
      return notes;
    });
  });
}
