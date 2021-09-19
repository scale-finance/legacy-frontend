import React, { useState } from 'react'

import { style } from './Dropdown.style'

import { View, Animated } from 'react-native'
import Text from '../Text/Text'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'

import { findByType } from '../../helper/findByType'
import { renderDivider } from '../../helper/renderDivision'
import uuid from 'react-native-uuid'
import { render } from 'react-dom'

const Item = () => null;
Item.displayName = "Item";

export default function Dropdown(props) {
    // state
    const opacity = useState(new Animated.Value(0))[0];
    const rotate = useState(new Animated.Value(0))[0];
    const [scale, setScale] = useState(0);

    /**
     * Renders all the items in the children props
     * 
     * @returns render ready list of dropdown items
     */
    const renderItems = () => {
        const { children, placeholder } = props;
        const items = findByType(children, Item);

        if (!items.length) return;

        return items.map((item, index) => {
            let comparison = placeholder.localeCompare(item.props.children);
            return comparison ? (
                <TouchableOpacity key={uuid.v4()} {...item.props} style={style.item}>
                    <Text>{item.props.children}</Text>
                    { renderDivider(index, !comparison ? items.length - 2 : items.length - 1) }
                </TouchableOpacity>
            ) : null
        })
    }

    const animateMenu = () => {
        if (scale !== 1) {
            setScale(1)
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start()

            Animated.timing(rotate, {
                toValue: 180,
                duration: 300,
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => setScale(0));

            Animated.timing(rotate, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }

    const menuAnimation = {
        opacity: opacity,
        transform: [{scale}]
    }

    const rotateCarat = {
        transform: [{rotate: rotate.interpolate({ inputRange: [0, 180], outputRange: ["0deg", "180deg"]})}]
    }

    return (
        <View style={{position: "relative"}}>
            <TouchableOpacity onPress={() => animateMenu()}>
                <View style={style.button}>
                    <Text style={{color: "black"}}>
                        {props.placeholder}
                    </Text>
                    <Animated.View style={rotateCarat}>
                        <MaterialIcons name="keyboard-arrow-down" style={style.icon}/>
                    </Animated.View>
                </View>
            </TouchableOpacity>
            <Animated.View style={[style.menu, menuAnimation]}>
                {renderItems()}
            </Animated.View>
        </View>
    )
}

Dropdown.Item = Item;