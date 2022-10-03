import { Checkin } from "../models/Checkin";

// Reads all checkins from the cache.
export const read_all_check_ins = (): Array<Checkin> => {
    return []
}

// Deletes a given checkin with id from the cache.
export const delete_check_in = (id: string): string => {
    return "";
}

// Inserts a checkin into the cache at the back
export const insert_check_in = (check_in: Checkin) => {
    // check_in should have a .save() function
}

/**
 * Delete list of checkins from the database
 * @param ids 
 * @returns {Array<string>} an array of all the successful deletes
 */
export const delete_checkin_list = (ids: Array<string>): Array<string> => {
    // TODO: the implementation is fine if you just return `ids`.
    // we can just assume the deletion succeeded.
    // you should NOT just write a for loop here...
    return []
}

// deletes the top checkin (pop)
export const delete_top_checkin = () => {

}

