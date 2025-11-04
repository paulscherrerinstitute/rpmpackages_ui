export function getName(pkge: string): string {
  let split = pkge.split(/-[0-9]{1}/g)[0];
  return split;
}

export function getVersion(pkge: string): string {
  let version = pkge
    .replace(getName(pkge), "")
    .replace(".rpm", "")
    .split(/.[A-Za-z]/g)[0];
  return clipSides(version);
}

export function getDistribution(pkge: string) {
  const arch = pkge
    .replace(getName(pkge), "")
    .replace(getVersion(pkge), "")
    .replace(".rpm", "")
    .split(".")
    .reverse();
  const clipped = clipSides(arch[1]);
  return clipped != undefined ? clipped : "";
}

export function getArchitecture(pkge: string) {
  const arch = pkge
    .replace(getName(pkge) + "-", "")
    .replace(getVersion(pkge) + ".", "")
    .replace(".rpm", "")
    .split(".")
    .reverse();
  return clipSides(arch[0]);
}

export function getVersionNote(pkge: string): string {
  const versionnote = pkge
    .replace(getName(pkge), "")
    .replace(getDistribution(pkge), "")
    .replace(getVersion(pkge), "")
    .replace(".rpm", "")
    .replace(getArchitecture(pkge), "");
  return clipSides(versionnote);
}

export function clipSides(str: string) {
  if (str == null) return str;
  while (
    str.startsWith("-") ||
    str.startsWith(".") ||
    str.endsWith("-") ||
    str.endsWith(".")
  ) {
    // Remove leading or trailing '-' or '.'
    if (str.startsWith("-") || str.startsWith(".")) {
      str = str.slice(1);
    }
    if (str.endsWith("-") || str.endsWith(".")) {
      str = str.slice(0, -1);
    }
  }
  return str;
}
