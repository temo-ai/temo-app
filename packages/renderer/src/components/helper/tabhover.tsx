import {motion} from 'framer-motion';
const TabHover = ({tabName}: {tabName: string}) => {
  return (
    <motion.div
      initial={{opacity: 0, y: 0}}
      animate={{opacity: 1, y: 0, transition: {delay: 0.6}}}
      exit={{opacity: 0, y: 0}}
      transition={{delay: 0, duration: 0.2}}
      className="hidden group-hover:block top-[46px] absolute z-[999] transition-all duration-500 ease-in-out"
    >
      <div className=" rounded-lg overflow-hidden  flex-col text-xs bg-primary-foreground p-4">
        <div className="text-secondary-foreground">{tabName}</div>
      </div>
    </motion.div>
  );
};

export default TabHover;
