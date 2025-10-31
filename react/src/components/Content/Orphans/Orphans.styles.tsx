import { type SxProps, type Theme } from "@mui/material";

export const wrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  padding: 1,
  marginTop: 0.5,
  width: "100%",
  overflowX: "clip",
  "& > div": {
    marginBlock: 2,
  },
  "& > * > table": {
    tableLayout: "fixed",
  },
};

export const titleWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 1,
};

export const searchWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "end",
  "& > svg": {
    marginInlineStart: 2,
    cursor: "pointer",
  },
};

export const fileOrphanIcons: SxProps<Theme> = {
  "& > svg": {
    marginInline: 0.5,
    cursor: "pointer",
  },
  display: "flex",
  flexDirection: "row",
  marginInline: 0.5,
  justifyContent: "end",
};

export const packageOrphanIcons: SxProps<Theme> = {
  "& > svg": {
    marginInline: 0.75,
  },
  display: "flex",
  flexDirection: "row",
  justifyContent: "end",
};

// UploadFileDialog
export const dialogueWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  padding: 2,
  "& > * > button": {
    margin: 2,
    width: "10vw",
  },
  "& > *": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
};

export const dialogueTitleWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBottom: 0.75,
  borderBottom: "1px solid rgba(150, 150, 150, 0.3)",
};

export const dialogueButtonWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};
