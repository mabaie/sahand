'use strict'
const Joi = require('joi');
const nationalIdJoi = require('../services/validation/JoiWithNationalId');
const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;

module.exports = Joi.object().keys({
        P1_id: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).optional(),
        P2_id: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).optional(),
        _id: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).optional(),
        P1FirstName: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp).required(),
        P1LastName: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp).required(),
        P1FatherName: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp).required(),
        P1ID: nationalIdJoi.string().trim().min(10).max(10).isNationalId().required(),
        P1EducationalDegree: Joi.string().trim().valid('زیر دیپلم', 'دیپلم', 'کارشناسی', 'کارشناسی ارشد', 'دکتری'),
        P1Major: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp),
        P1BirthDay: Joi.string().isoDate().required(),
        P1Job: Joi.string().trim().min(3).max(30)
            .regex(persianStringRegExp).required(),
        P1Mobile: Joi.string().regex(/^9[0-9][0-9]{8}$/).required(),
        P1Email: Joi.string().email({
            minDomainAtoms: 2
        }).required(),
        P1HomePhone:Joi.string().regex(/^[1-8][0-9][0-9]{8}$/),
        P1HomeAddress: Joi.string().min(6).max(100).required(),
        P1WorkAddress: Joi.string().min(6).max(100).required(),

        P2FirstName: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp),
        P2LastName: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp),
        P2FatherName: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp),
        P2ID: nationalIdJoi.string().trim().min(10).max(10).isNationalId(),
        P2EducationalDegree: Joi.string().trim().valid('زیر دیپلم', 'دیپلم', 'کارشناسی', 'کارشناسی ارشد', 'دکتری'),
        P2Major: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp),
        P2BirthDay: Joi.string().isoDate(),
        P2Job: Joi.string().trim().min(3).max(30)
            .regex(persianStringRegExp),
        P2Mobile: Joi.string().regex(/^9[0-9][0-9]{8}$/),
        P2HomePhone:Joi.string().regex(/^[1-8][0-9][0-9]{8}$/),
        P2Email: Joi.string().email({
            minDomainAtoms: 2
        }),
        P2HomeAddress: Joi.string().min(6).max(100),
        P2WorkAddress: Joi.string().min(6).max(100),

        FirstName: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp).required(),
        LastName: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp).required(),
        FatherName: Joi.string().trim().min(3).max(50)
            .regex(persianStringRegExp).required(),
        ID: nationalIdJoi.string().trim().min(10).max(10).isNationalId().required(),
        BirthDay: Joi.string().isoDate().required(),
        Mobile: Joi.string().regex(/^9[0-9][0-9]{8}$/).required(),
        Email: Joi.string().email({
            minDomainAtoms: 2
        }).required(),
        Grade: Joi.string().trim().valid('پیش‌دبستانی', 'اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم').required(),
        Image: Joi.string(),
        BirthPlace: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
        IssuePlace: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
        Religion: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
        Mazhab: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
        Citizenship: Joi.string().trim().min(3).max(50)
        .regex(persianStringRegExp),
        AcademicYear: Joi.string().isoDate()
    }).with('P2FirstName', 'P2LastName')
    .with('P2LastName', 'P2FatherName')
    .with('P2FatherName', 'P2ID')
    .with('P2ID', 'P2BirthDay')
    .with('P2BirthDay', 'P2Job')
    .with('P2Job', 'P2Mobile')
    .with('P2Mobile', 'P2Email')
    .with('P2Email', 'P2HomeAddress')
    .with('P2HomeAddress', 'P2WorkAddress')
    .with('P2WorkAddress','P2FirstName');