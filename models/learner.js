const Model = require('./base')
const api = require('../services/google')

class Learner extends Model{
    uuid

    constructor(obj){
        super()
        if(obj){
            this.first_name = obj.first_name
            this.middle_name = obj.middle_name
            this.last_name = obj.last_name
            this.suffix = obj.suffix
            this.prefix = obj.prefix
            this.preferred_name = obj.preferred_name
            this.preferred_first_name = obj.preferred_first_name
            this.preferred_middle_name = obj.preferred_middle_name
            this.preferred_last_name = obj.preferred_last_name
            this.preferred_name_type = obj.preferred_name_type
            this.preferred_pronoun = obj.preferred_pronoun
            this.student_identifier = obj.student_identifier
            this.student_identifier_system = obj.student_identifier_system
            this.personal_information_verification = obj.personal_information_verification
            this.personal_information_type = obj.personal_information_type
            this.address_type = obj.address_type
            this.street_number_and_name = obj.street_number_and_name
            this.apartment_room_or_suite_number = obj.apartment_room_or_suite_number
            this.city = obj.city
            this.state_abbreviation = obj.state_abbreviation
            this.postal_code = obj.postal_code
            this.country_name = obj.country_name
            this.country_code = obj.country_code
            this.latitude = obj.latitude
            this.longitude = obj.longitude
            this.country_ansi_code = obj.country_ansi_code
            this.address_do_not_publish_indicator = obj.address_do_not_publish_indicator
            this.phone_number = obj.phone_number
            this.email_address_type = obj.email_address_type
            this.email_address = obj.email_address
            this.email_do_not_publish_indicator = obj.email_do_not_publish_indicator
            this.backup_email_address = obj.backup_email_address
            this.birth_date = obj.birth_date
            this.gender = obj.gender
            this.country_of_birth_code = obj.country_of_birth_code
            this.ethnicity = obj.ethnicity
            this.employer_id = obj.employer_id
            this.employer = obj.employer
            this.employer_email = obj.employer_email
            this.organisation_email_id = obj.organisation_email_id
            this.affiliation = obj.affiliation
            this.uuid = obj.uuid
        }
    }

    static async getAll() {
        let all = await api.getAllLearners()
        return all
    }

    static async search(term){
        let res = await api.searchLearner(term)
        return res
    }

    async create(){
        let res = await api.saveLearner(this)
        return res
    }

    static async delete(uuid){
        let res = await api.deleteLearner(uuid)
        return res
    }

    async update(){
        let res = await api.updateLearner(this)
        return res
    }

}

module.exports = Learner