import { Checkin } from "../models/Checkin";

// Reads all checkins from the cache.
export const read_all_check_ins = (): Array<Checkin> => {
    return []
}

// Deletes a given checkin with id from the cache.
export const delete_check_in = async(id: string) => {
    await Checkin.delete(id)
}

// Inserts a checkin into the cache at the back
export const insert_check_in = async(check_in: Checkin) => {
    await check_in.save()
}

/**
 * Delete list of checkins from the database
 * @param ids an array of prim strings to delete from the database.
 * @returns {Array<string>} an array of all the successful deletes
 */
export const delete_checkin_list = async(ids: Array<string>) => {
    await Checkin.delete(ids)
}

// deletes the top checkin (pop)
export const delete_top_checkin = () => {
    
}

