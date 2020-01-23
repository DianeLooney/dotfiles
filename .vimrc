set runtimepath^=~/.vim/bundle/ctrlp.vim
filetype plugin indent on
syntax on
set hlsearch
set backspace=indent,eol,start
set cursorline
hi Normal guibg=NONE ctermbg=NONE

" Diffs
if &diff                             " only for diff mode/vimdiff
  set diffopt=filler,context:1000000 " filler is default and inserts empty lines for sync
endif

" Line Numbers
set number relativenumber
augroup numbertoggle
  autocmd!
  autocmd BufEnter,FocusGained,InsertLeave * set relativenumber
  autocmd BufLeave,FocusLost,InsertEnter   * set norelativenumber
augroup END

" Pathogen
execute pathogen#infect()

" CtrlP
let g:ctrlp_clear_cache_on_exit = 0
let g:ctrlp_max_files = 0
let g:ctrlp_custom_ignore = 'vendor\|node_modules\|DS_Store\|git'
let g:ctrlp_map = '<c-p>'
let g:ctrlp_cmd = 'CtrlP'
let g:ctrlp_working_path_mode = 'ra'

" Rainbow Parens
au VimEnter * RainbowParenthesesToggle
au Syntax * RainbowParenthesesLoadRound
au Syntax * RainbowParenthesesLoadSquare
au Syntax * RainbowParenthesesLoadBraces

" Custom keyboard shortcuts
map <F2> :Vex <Cr>

" Racket
if has("autocmd")
  au BufReadPost *.rkt,*.rktl set filetype=scheme
endif

" Spacecamp
colorscheme spacecamp

" Whitespace
syntax on
set syntax=whitespace

" Tabs
filetype plugin indent on
set expandtab
set tabstop=2
set softtabstop=2
set shiftwidth=2

