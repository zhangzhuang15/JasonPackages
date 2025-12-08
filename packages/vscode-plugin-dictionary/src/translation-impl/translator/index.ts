import { 
    name as icibaName, 
    requestContextBuilder as icibaRequestContextBuilder, 
    translate as icibaTranslate
} from "@/translation-impl/translator/iciba/index";

export default {
    [icibaName]: {
        requestContextBuilder: icibaRequestContextBuilder, 
        translate: icibaTranslate 
    }
}