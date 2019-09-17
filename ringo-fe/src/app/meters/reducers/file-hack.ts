
// since state can't contain non-serialisable objects, and File is non-serialisable, we resort to a global.
export let gBadHackImportFile: File | null = null;
