def extract_tags(markdown:str):

    # extracting yaml part
    yaml_start = markdown.find("---")
    yaml_end = markdown.find("---",2)
    yaml_tags = markdown[yaml_start+4:yaml_end-1]
    tag_list = yaml_tags.split("\n")
    tags = {}

    # updating markdown file
    markdown = markdown[yaml_end+3:]

    for tag in tag_list:
        key,value = tag.split(":")
        tags[key.strip()] = value.strip()
    print(tags)
    return tags,markdown
