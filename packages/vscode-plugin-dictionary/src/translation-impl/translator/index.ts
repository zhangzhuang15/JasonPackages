import { 
    name as icibaName, 
    requestContextBuilder as icibaRequestContextBuilder, 
    translate as icibaTranslate
} from "@/translation-impl/translator/iciba/index";
import {
    name as youdaoName, 
    requestContextBuilder as youdaoRequestContextBuilder, 
    translate as youdaoTranslate
} from "@/translation-impl/translator/youdao/index";

export default {
    [icibaName]: {
        requestContextBuilder: icibaRequestContextBuilder, 
        translate: icibaTranslate 
    },
    [youdaoName]: {
        requestContextBuilder: youdaoRequestContextBuilder, 
        translate: youdaoTranslate
    }
}