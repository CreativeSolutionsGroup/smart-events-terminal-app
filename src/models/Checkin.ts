import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Checkin {
    @PrimaryColumn()
    mac_address!: string

    @Column()
    student_id!: string
}