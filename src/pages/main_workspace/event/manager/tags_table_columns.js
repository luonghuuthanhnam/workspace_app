import { PlusOutlined } from '@ant-design/icons';
import { Input, Space, Tag, Tooltip, theme, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

const TagColumn = (props) => {
    const { token } = theme.useToken();
    const [tags, setTags] = useState(['Tên']);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef(null);
    const editInputRef = useRef(null);
    useEffect(() => {
        props.onTagsChange(tags);
    }, [tags, props]);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);
    useEffect(() => {
        editInputRef.current?.focus();
    }, [inputValue]);
    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        console.log(newTags);
        setTags(newTags);
        // props.onTagsChange(tags);
    };
    const showInput = () => {
        setInputVisible(true);
    };
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) { // check for duplicate tag
            setTags([...tags, inputValue]);
        }
        else {
            if (inputValue !== "") {
                Modal.error({
                    title: 'Error',
                    content: `Cột "${inputValue}" đã tồn tại!`,
                });
            }
        }
        setInputVisible(false);
        setInputValue('');
    };
    const handleEditInputChange = (e) => {
        setEditInputValue(e.target.value);
    };
    const handleEditInputConfirm = () => {
        if (editInputValue && tags.indexOf(editInputValue) === -1) { // check for duplicate tag
            const newTags = [...tags];
            newTags[editInputIndex] = editInputValue;
            setTags(newTags);
        }
        else {
            if (inputValue !=="") {
                Modal.error({
                    title: 'Error',
                    content: `Cột "${inputValue}" đã tồn tại!`,
                });
            }
        }
        setEditInputIndex(-1);
        setEditInputValue('');
    };

    const tagInputStyle = {
        width: "8vw",
        fontSize: "16px",
        verticalAlign: 'top',
    };
    const tagPlusStyle = {
        background: token.colorBgContainer,
        borderStyle: 'dashed',
    };
    return (
        <Space size={[0, 8]} wrap>
            <Space size={[0, 8]} wrap>
                {tags.map((tag, index) => {
                    if (editInputIndex === index) {
                        return (
                            <Input
                                ref={editInputRef}
                                key={tag}
                                size="small"
                                style={tagInputStyle}
                                value={editInputValue}
                                onChange={handleEditInputChange}
                                onBlur={handleEditInputConfirm}
                                onPressEnter={handleEditInputConfirm}
                            />
                        );
                    }
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag
                            key={tag}
                            closable={index >= 2}
                            style={{
                                userSelect: 'none',
                                fontSize: "16px"
                            }}
                            onClose={() => handleClose(tag)}
                        >
                            <span
                                onDoubleClick={(e) => {
                                    if (index !== 0) {
                                        setEditInputIndex(index);
                                        setEditInputValue(tag);
                                        e.preventDefault();
                                    }
                                }}
                            >
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </span>
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                        tagElem
                    );
                })}
            </Space>
            {inputVisible ? (
                <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={tagInputStyle}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            ) : (
                <Tag style={tagPlusStyle} onClick={showInput}>
                    <PlusOutlined /> Thêm cột
                </Tag>
            )}
        </Space>
    );
};
export default TagColumn;