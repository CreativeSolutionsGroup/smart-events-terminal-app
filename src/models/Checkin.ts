import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Checkin extends BaseEntity {
    @Column()
    mac_address!: string

    @PrimaryColumn()
    student_id!: string
}