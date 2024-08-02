export const getUploadETA = ({ uploadedFilesLength }) => {
    const minutes = Math.ceil((15 * uploadedFilesLength) / 60);
    return minutes > 1 ? `>${minutes} mins` : "> 1 min";
};