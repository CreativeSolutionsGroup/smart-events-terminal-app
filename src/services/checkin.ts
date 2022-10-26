import { In } from "typeorm";
import { Checkin } from "../models/Checkin";

// Deletes a given checkin with id from the cache.
export const delete_check_in = async (id: string) => {
    await Checkin.delete(id)
}

// Inserts a checkin into the cache at the back
export const insert_check_in = async (check_in: Checkin) => {
    await check_in.save()
}

export const delete_bulk_checkin = async (ids: Array<string>) => {
    await Checkin.delete(ids)
}