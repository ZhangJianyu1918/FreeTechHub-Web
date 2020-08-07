import Model from "./Model"
import Tag from "./Tag"
import marked from 'marked'
import axios from 'axios'
import BASE_URL from '../consts'

class Blog extends Model {
    static app_name = 'blog'
    static model_name = 'blog'

    // the input argument must be something like:
    constructor({id, title, content, date, viewTimes, owner,
                 tags, series, like_num, dislike_num, content_type_id}) {
        
        super({title, content, owner, viewTimes, series})  // data fields that is requried when save
        // required data fields
        this.app_name = 'blog'
        this.model = "blog"
        this.pk = id

        // this custom data for Blog
        this.date = date
        this.owner = owner
        this.like_num = like_num
        this.dislike_num = dislike_num
        this.content_type_id = content_type_id
        this.m_content = marked(this.content)

        if (tags != undefined) {
            this.tags = []
            tags.forEach(tag => { this.tags.push(new Tag(tag)) })
        }
    }

    // blog custom methods
    async like() {
        let res = await axios.post(BASE_URL + `like/like-item/`, {
            like_type: true,
            object_id: this.pk,
            content_type: this.content_type_id
        })
        return res.data
    }

    async dislike() {
        let res = await axios.post(BASE_URL + `like/like-item/`, {
            like_type: false,
            object_id: this.pk,
            content_type: this.content_type_id
        })
        return res.data
    }

    async getLikeHistory() {
        let res = await axios.get(BASE_URL + `like/like-history/`, {
            params: {
                object_id: this.pk,
                content_type: this.content_type_id
            }
        })
        return res.data
    }

    // get model by id
    static async get(id) {
        return await Model._getOne(this.app_name, this.model_name, id, this)
    }

    // get all the model
    static async all() {
        return await Model._raw_all(this.app_name, this.model_name, this)
    }
}

export default Blog
