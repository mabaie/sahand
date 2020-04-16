'use strict';
const Joi = require('joi');
module.exports = Joi.object().keys({
    register_min: Joi.string().isoDate().required(),
    register_max: Joi.string().isoDate().required(),
    birth_min: Joi.string().isoDate().required(),
    birth_max: Joi.string().isoDate().required(),
    birth_month: Joi.number().min(0).max(12).required(),
    grade: Joi.string().trim().valid('default','پیش‌دبستانی', 'اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم').required(),
    cname: Joi.string().trim().min(0).max(50),
})
/*
  {
    register_min:this.state.registerMin.toISOString(),
    register_max:this.state.registerMax.toISOString(),
    birth_min:this.state.birthMin.toISOString(),
    birth_max:this.state.birthMax.toISOString(),
    birth_month:this.state.birthMonth,
    grade: this.state.grade==0 ? "default": this.grades[this.state.grade],
    cname: this.state.cname==0 ? "default": this.cnames[this.state.cname]
  }
*/
