import React, {Component, PropTypes} from 'react'
import {forEach} from 'lodash'

export default class MembersListScene extends Component {
    /**
     * members Список участников:
     *  [{
     *      personId: string || number,
     *      name: string
     *  }]
     * onFinish Закончить выбор участников.
     */
    static propTypes = {
        members: PropTypes.arrayOf(PropTypes.shape({
            personId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string
        })),
        selectMember: PropTypes.func
    }

    constructor (props) {
        super(props)
        let selectedMembers
        forEach(props.members, )
        
        this.state = {
            selectedMembers: members.map(member => ({}))
        }
    }

    render () {

    }
}