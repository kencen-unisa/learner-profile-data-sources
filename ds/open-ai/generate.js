const service = require ('../../services/open-ai')

getSyntheticLearnerObjects(2)///////
async function getSyntheticLearnerObjects(numResults = 3) {
    // let prompt = `Please generate synthetic data for demographics in JSON array format. I need ${numResults} examples in structure like {uuid:"5a9e0b49-b029-4813-8a1b-ec7eb5536577", first_name:"Mickey", last_name:"Mouse", phone:"0422 356 942"}. JSON response:`
    let prompt = `Can you generate synthetic data for demographics please. I need ${numResults} examples in structure like 
        {
            "uuid": "5a9e0b49-b029-4813-8a1b-ec7eb5536577",
            "first_name": "John",
            "middle_name": "Michael",
            "last_name": "Doe",
            "suffix": "",
            "prefix": "",
            "preferred_name": "Johnny Doe",
            "preferred_first_name": "Johnny",
            "preferred_middle_name": "Michael",
            "preferred_last_name": "Doe",
            "preferred_name_type": "PreferredName",
            "preferred_pronoun": "He",
            "student_identifier": "",
            "student_identification_system": "",
            "personal_information_verification": "",
            "personal_information_type": "",
            "address_type": "",
            "street_number_and_name": "1 King William Street",
            "apartment_room_or_suite_number": "",
            "city": "Adelaide",
            "state_abbreviation": "SA",
            "postal_code": "5000",
            "country_name": "Australia",
            "country_code": "AU",
            "latitude": "-34.921896",
            "longitude": "138.599080",
            "country_ansi_code": 10000,
            "address_do_not_publish_indicator": "Yes",
            "phone_number": {
            "mobile": {
                "phone_number_type": "Work",
                "primary_phone_number_indicator": "Yes",
                "phone_number": "0400000000",
                "phone_do_not_publish_indicator": "Yes",
                "phone_number_listed_status": "Listed"
            },
            "telephone": {
                "phone_number_type": "Home",
                "primary_phone_number_indicator": "No",
                "phone_number": "",
                "phone_do_not_publish_indicator": "Yes",
                "phone_number_listed_status": "Listed"
            }
            },
            "email_address_type": "Work",
            "email_address": "jhon.doe@gmail.com",
            "email_do_not_publish_indicator": "Yes",
            "backup_email_address": "jhon.doe2@gmail.com",
            "birth_date": "2000-09-21",
            "gender": "NotSelected",
            "country_of_birth_code": "AU",
            "ethnicity": "",
            "employer_id": "test_employer_id",
            "employer": "Foobar",
            "employer_email": "testid@employer.com",
            "organisation_email_id": "jhon.doe@foobar.com",
            "affiliation": ""
        } 
    JSON response: `//<-- without this phrase, reply includes "Sure! Here's ...." etc text along with JSON !
    
    let retval = await service.callChatCompletionAPI(prompt)
    console.log(retval)/////////
    return retval
}

