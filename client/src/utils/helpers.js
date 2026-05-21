export const createSlug = (name) =>{
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
        .replace(/\s+/g, "-")            // spaces to hyphens
        .replace(/-+/g, "-")             // multiple hyphens to one
        .trim();
}